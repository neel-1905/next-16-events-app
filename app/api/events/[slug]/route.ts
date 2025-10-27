import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/**
 * Type definition for API response
 * Ensures type-safe responses across all scenarios
 */
interface ApiResponse<T = IEvent> {
  message: string;
  data?: T;
  error?: string;
}

/**
 * Type definition for route parameters
 * Ensures slug parameter is properly typed
 */
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug parameter
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing the event slug
 * @returns JSON response with event data or error message
 *
 * Status Codes:
 * - 200: Event found and returned successfully
 * - 400: Invalid or missing slug parameter
 * - 404: Event not found in database
 * - 500: Server error during database operation
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    // Await the params promise to get the actual parameters
    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json<ApiResponse>(
        {
          message: "Invalid request",
          error: "Slug parameter is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    // Normalize slug to lowercase for case-insensitive search
    const normalizedSlug = slug.toLowerCase().trim();

    // Connect to MongoDB
    await connectDB();

    // Query database for event with matching slug
    const event = await Event.findOne({ slug: normalizedSlug }).lean<IEvent>();

    // Handle event not found
    if (!event) {
      return NextResponse.json<ApiResponse>(
        {
          message: "Event not found",
          error: `No event found with slug: ${normalizedSlug}`,
        },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json<ApiResponse>(
      {
        message: "Event fetched successfully",
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error("Error fetching event by slug:", error);

    // Return generic error response
    return NextResponse.json<ApiResponse>(
      {
        message: "Failed to fetch event",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
